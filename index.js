var fetch = require("make-fetch-happen");

async function target(productId) {
    try {
        const response = await fetch(
            'https://redsky.target.com/redsky_aggregations/v1/web_platform/product_fulfillment_v1?key=9f36aeafbe60771e321a7cc95a78140772ab3e96&tcin=' +
            productId +
            '&store_id=2364&zip=32136&state=FL&latitude=29.487638&longitude=-81.133531&required_store_id=2364&has_required_store_id=true'
        );
        const jsonResponse = await response.json();
        if (jsonResponse.data.product.fulfillment.shipping_options.availability_status !== 'OUT_OF_STOCK') {
            await fetch('https://discord.com/api/webhooks/916391999928664084/XHaLs6sme9wIa0UcUKiLS0YokOBdBAPhXjcMsIEcTSmH3dmCUQfdHflZoQtHz3jwBgxc', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: "Target Bot",
                    avatar_url: "http://img2.wikia.nocookie.net/__cb20131215030942/logopedia/images/thumb/e/e1/Target-logo1.png/485px-Target-logo1.png",
                    content: "@everyone PRODUCT IN STOCK: https://www.target.com/p/ez/-/A-" + productId
                })
            });
            return {
                status: JSON.stringify(jsonResponse.data.product.fulfillment.shipping_options.availability_status),
                itemId: productId
            };
        } else {
            console.log(`[${productId}]` + ` OUT OF STOCK`);
        }
    } catch (error) {
        console.log(error);
    }
    return null;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkForStock() {
    while (true) {
        let results = await Promise.all([target(79550220), target(53270055)]);
        for (const value of results) {
            if (value != null) {
                console.log(value);
            }
        }
        await sleep(7500);
    }
}

async function run() {
    await checkForStock();
}

run();