const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());


const storagePath = path.join(process.cwd(), 'storage');

// Endpoint to get data
app.get('/data', (req, res) => {
    try {
        const fileContent = fs.readFileSync(storagePath + '/data.json', 'utf8');
        res.send(fileContent);
    } catch (err) {
        console.log(err)
        res.status(404).send('File not found');
    }
});

// Endpoint to update data
app.put('/data/:date', (req, res) => {
    const date = req.params.date;
    // Ensure fileData is an object if it wasn't initialized within the catch block above.
    let fileData = {};

    try {
        // Attempt to read the file. If it doesn't exist or an error occurs, catch block will handle it.
        fileData = fs.readFileSync(storagePath + '/data.json', 'utf8');
        
        // Parse the JSON data from the file
        fileData = JSON.parse(fileData);
    } catch (err) {
        console.log(err)
        res.status(500).send('Internal Server Error');
    }

    if (fileData[date] === undefined) {
        fileData[date] = { Enrico: 0, Stefano: 0 };
    }

    // Update data based on request body
    fileData[date].Enrico = req.body.Enrico || fileData[date].Enrico;
    fileData[date].Stefano = req.body.Stefano || fileData[date].Stefano;

    // Write the updated data back to the JSON file
    fs.writeFileSync(storagePath + '/data.json', JSON.stringify(fileData, null, 2));
    
    res.status(200).send('Data updated successfully');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));