import { table, findRecordByFilter, getMinifiedRecords } from "@/lib/airtable";

const upvoteCoffeeStoreById  = async (req,res) => {
    if (req.method === "PUT") {
        try {
            const { id } = req.body;
            if (id) {
                const records = await findRecordByFilter(id);
                if (records.length !== 0) {
                    const record = records [0];
                    const calculateVoting = parseInt(record.voting) + 1;
                    console.log({calculateVoting, id: record.id});
                    //update record
                    const updateRecords = await table.update ([
                        {
                          "id": record.recordId,
                          "fields": { "voting": calculateVoting },
                        },
                    ])
                    if (updateRecords) {
                        const minifiedRecords = getMinifiedRecords(updateRecords)
                        res.json(minifiedRecords);    
                    }
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