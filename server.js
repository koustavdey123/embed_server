const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors({
    origin: 'http://localhost:5500' // Adjust to your actual client port
}));
app.use(express.json());

const tenantID = "611c0984-8feb-4e66-8a8c-0734b1571503";
const client_id = "dcdada84-9010-4372-9b7e-6d7b7dae3910";
const client_secret = "jAJ8Q~tlv6ptTKL2oaAeTEchmAtqqh3lBNSWAcdd";
const scope = "https://analysis.windows.net/powerbi/api/.default";
const accessTokenUrl = `https://login.microsoftonline.com/${tenantID}/oauth2/v2.0/token`;

app.post('/getAccessToken', async (req, res) => {
    const data = new URLSearchParams();
    data.append('grant_type', 'client_credentials');
    data.append('client_id', client_id);
    data.append('client_secret', client_secret);
    data.append('scope', scope);

    try {
        const response = await fetch(accessTokenUrl, {
            method: 'POST',
            body: data
        });
        const result = await response.json();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch access token' });
    }
});

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
