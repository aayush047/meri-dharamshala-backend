// controllers/dharamshalaController.js (Updated to enforce ownership)

const Dharamshala = require("../models/Dharamshala");
const Donor = require("../models/Dharamshala"); // Assuming Donor model is correctly imported
const sharp = require("sharp"); // Assuming image processing dependencies are installed
const fs = require("fs");

// Helper function to extract Owner ID from request
const getOwnerId = (req) => {
    // Check query parameter (used by GET, PUT, DELETE in Flutter code)
    if (req.query.ownerId) return req.query.ownerId;
    // Check body (used by POST in Flutter code)
    if (req.body.ownerId) return req.body.ownerId;
    return null; 
}

// ---------------- GET all Dharamshalas (Owner-Filtered) ----------------
exports.getDharamshalas = async (req, res) => {
    try {
        const ownerId = getOwnerId(req);
        if (!ownerId) {
            return res.status(401).json({ message: "Error: Owner ID missing for authentication." });
        }

        const data = await Dharamshala.aggregate([
            // ✅ STAGE 1: Filter by ownerId to show only the user's data
            { $match: { ownerId: ownerId } }, 

            // Stage 2: Look up Donors related to each Dharamshala (assuming you need donor counts)
            {
                $lookup: {
                    from: 'donors', 
                    localField: '_id', 
                    foreignField: 'dharamshalaId', 
                    as: 'relatedDonors'
                }
            },

            // Stage 3: Calculate aggregated fields (Total Paid Donors)
            {
                $addFields: {
                    totalPaidDonors: {
                        $size: {
                            $filter: {
                                input: "$relatedDonors",
                                as: "donor",
                                cond: { $eq: ["$$donor.paid", true] } 
                            }
                        }
                    },
                    totalDonors: { $size: "$relatedDonors" }
                }
            },

            // Stage 4: Project/Select the final fields
            {
                $project: {
                    _id: 1,
                    title: 1,
                    address: 1,
                    capacity: 1,
                    bookings: 1, 
                    image: 1,
                    totalPaidDonors: 1, 
                    totalDonors: 1, 
                    ownerId: 1, 
                    relatedDonors: 0, 
                }
            }
        ]);
        
        res.json(data);
    } catch (err) {
        console.error("Error fetching dharamshalas with aggregation:", err);
        res.status(500).json({ message: err.message });
    }
};

// ---------------- POST add Dharamshala ----------------
exports.addDharamshala = async (req, res) => {
    try {
        // ✅ ownerId must be present in the request body
        const { title, address, capacity, ownerId } = req.body; 
        
        if (!title || !address || !capacity || !ownerId) {
            return res.status(400).json({ message: "Missing required fields (title, address, capacity, ownerId)" });
        }

        let imagePath = "";
        if (req.file) {
            // Placeholder for your image processing/optimization logic
            const optimizedPath = `uploads/optimized-${req.file.filename}`;
            try {
                // Ensure sharp/fs logic is correctly implemented on your server
                await sharp(req.file.path)
                    .resize(800, 600, { fit: "inside" })
                    .jpeg({ quality: 75 })
                    .toFile(optimizedPath);
                fs.unlinkSync(req.file.path);

                imagePath = `https://meri-dharamshala-backend-3.onrender.com/${optimizedPath}`;
            } catch (err) {
                console.error("Image processing failed:", err);
            }
        }

        const dharamshala = new Dharamshala({
            title,
            address,
            capacity,
            bookings: 0,
            image: imagePath || "https://via.placeholder.com/800x600",
            ownerId, // ✅ Save the ownerId
        });

        const saved = await dharamshala.save();
        res.status(201).json(saved);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// ---------------- PUT update Dharamshala ----------------
exports.updateDharamshala = async (req, res) => {
    try {
        const updateData = req.body;
        // ownerId is expected in query parameters for authorization
        const ownerId = getOwnerId(req); 
        
        if (!ownerId) return res.status(401).json({ message: "Unauthorized: Owner ID missing." });
        
        // Prevent accidental ownerId change
        delete updateData.ownerId;
        
        if (req.file) {
            // Placeholder for your image processing/optimization logic
            const optimizedPath = `uploads/optimized-${req.file.filename}`;
            await sharp(req.file.path)
                .resize(800, 600, { fit: "inside" })
                .jpeg({ quality: 75 })
                .toFile(optimizedPath);
            fs.unlinkSync(req.file.path);

            updateData.image = `https://meri-dharamshala-backend-3.onrender.com/${optimizedPath}`;
        }

        // ✅ Find by ID AND ownerId to enforce ownership
        const updated = await Dharamshala.findOneAndUpdate(
            { _id: req.params.id, ownerId: ownerId }, 
            updateData, 
            { new: true }
        );

        if (!updated) {
            // Not found OR ownerId does not match
            return res.status(404).json({ message: "Dharamshala not found or unauthorized to update." });
        }

        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// ---------------- DELETE Dharamshala ----------------
exports.deleteDharamshala = async (req, res) => {
    try {
        const ownerId = getOwnerId(req);
        if (!ownerId) return res.status(401).json({ message: "Unauthorized: Owner ID missing." });
        
        // ✅ Find and delete by ID AND ownerId to enforce ownership
        const result = await Dharamshala.findOneAndDelete({ _id: req.params.id, ownerId: ownerId });

        if (!result) {
            return res.status(404).json({ message: "Dharamshala not found or unauthorized to delete." });
        }

        // Delete related Donors for data integrity (optional but recommended)
        await Donor.deleteMany({ dharamshalaId: req.params.id }); 

        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};