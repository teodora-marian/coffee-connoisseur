import { findRecordByFilter } from "@/lib/airtable";

const upvoteCoffeeStoreById  = async (req,res) => {
    if (req.method === "PUT") {
        try {
            const { id } = req.body;
            if (id) {
                const records = await findRecordByFilter(id);
                if (records.length !== 0) {
                    res.json(records);
                } else {
                    res.json({message: "Store id doesn't exist", id});
                }
            } else {
                res.status(400);
                res.json({message:"id or name missing."})
            }
        } catch (err) {
            res.json(500);
            res.json({message: "Error upvoting store", err});
        }

        
    }
};

export default upvoteCoffeeStoreById;