// Get:

export async function get(url) {

    const response = await fetch(url);

    const products = await response.json();

    return products;

}

// Post

export async function post(url, body) {

    await fetch(url, {

        method: "POST",

        headers: {

            'Accept': 'application/json',

            'Content-Type': 'application/json'

        },

        body: JSON.stringify(body)

    });
    
}

// PUT:

export async function put(url, body) {
    
    await fetch(url, {

        method: "PATCH", // update one property only (quantity)

        headers: {

            'Accept': 'application/json',

            'Content-Type': 'application/json'

        },

        body: JSON.stringify(body)

    });

}

// DELETE:

export async function deleteFunc(url) {
    
    await fetch(url, { method: "DELETE" });

}
