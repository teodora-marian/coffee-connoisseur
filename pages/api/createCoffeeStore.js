import { table, getMinifiedRecords, findRecordByFilter } from "@/lib/airtable";

console.log ({table})

export default async function createCoffeeStore (req, res) {
    console.log({req});

    if (req.method === "POST") {
        //find a record
    const { id, name, address, locality, voting, imgUrl } = req.body;

    try {
      if (id) {
        const records = await findRecordByFilter(id);

          if (records.length !== 0) {
            res.json(records);
          } else {
          //create a record
          if (id && name) {
            const createRecords = await table.create([
              { fields: {id, name, address, locality, voting, imgUrl} },
            ]);
      
            const records = getMinifiedRecords(createRecords);
            res.json(records);
          }
          else {
              res.status(400);
              res.json({message:"id or name missing."})
          }
        }
      }
    } catch (err) {
          console.error("Error finding or creating a store.", err);
          res.status(500);
          res.json({ message: "Error finding or creating a store.", err });
    }
  }
};