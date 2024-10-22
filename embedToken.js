const client_id = "dcdada84-9010-4372-9b7e-6d7b7dae3910"; // Replace with your actual client_id
const client_secret = "jAJ8Q~tlv6ptTKL2oaAeTEchmAtqqh3lBNSWAcdd"; // Replace with your actual client_secret
const tenantID = "611c0984-8feb-4e66-8a8c-0734b1571503"; // Your tenant ID
const scope = "https://analysis.windows.net/powerbi/api/.default"; // Your scope
const groupId = "9d04f90c-3bc8-4b64-89a5-38b02a9ef877";
const reportId = "6b45161d-ed15-4bea-9ace-b11088f5d635";
const embedTokenUrl = `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/reports/${reportId}/GenerateToken`;


async function getAccessToken() {
    const data = new URLSearchParams();
    data.append('grant_type', 'client_credentials');
    data.append('client_id', client_id);
    data.append('client_secret', client_secret);
    data.append('scope', scope);

    const response = await fetch('http://localhost:5500/getAccessToken', {
        method: 'POST',
        body: data
    });

    if (!response.ok) {
        throw new Error('Failed to get access token');
    }

    const result = await response.json();
    return result.access_token;
}

async function getEmbedToken(accessToken) {
    const response = await fetch(embedTokenUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'accessLevel': 'View',
            'allowSaveAs': true
        })
    });

    if (!response.ok) {
        throw new Error('Failed to generate embed token');
    }

    const result = await response.json();
    return result.token;
}

async function getEmbedUrl(accessToken) {
    const embedURL = `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/reports/${reportId}`;
    const response = await fetch(embedURL, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to get embed URL');
    }

    const result = await response.json();
    return result.embedUrl;
}

async function main() {
    try {
        const accessToken = await getAccessToken();
        console.log("Access Token:", accessToken);

        const embedToken = await getEmbedToken(accessToken);
        console.log("Embed Token:", embedToken);

        const embedUrl = await getEmbedUrl(accessToken);
        console.log("Embed URL:", embedUrl);

        // Embed report configuration
        let models = window['powerbi-client'].models;
        let config = {
            type: 'report',
            tokenType: models.TokenType.Embed, // Make sure to reference TokenType properly
            accessToken: embedToken,
            embedUrl: embedUrl,
            id: reportId,  // Use the reportId that was defined earlier
            permissions: models.Permissions.All, // Define permissions if needed
            settings: {
                panes: {
                    filters: {
                        visible: true
                    },
                    pageNavigation: {
                        visible: true
                    }
                },
                bars: {
                    statusBar: {
                        visible: true
                    }
                }
            }
        };

        // Get a reference to the embedded report HTML element
        let embedContainer = document.getElementById('container-main'); // Assuming an HTML element with this ID exists

        if (!embedContainer) {
            throw new Error('Embed container not found');
        }

        // Embed the report and display it within the div container
        let report = powerbi.embed(embedContainer, config);
        console.log("Report embedded successfully.");
        
    } catch (error) {
        console.error("Error:", error);
    }
}

main();
