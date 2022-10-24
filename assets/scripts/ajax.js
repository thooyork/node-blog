
const BASE_URL = "http://localhost:5000";

const form = document.querySelector("form");

form.addEventListener("submit", async event => {
    event.preventDefault();

    const name = document.querySelector('#name').value;
    const pwd = document.querySelector('#password').value;

    try {
        const response = await fetch(`${BASE_URL}/login`, {
            method: "POST",
            credentials: "include",
            mode: "cors",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                password: pwd
            }),
        });

        const data = await response.json();
        sessionStorage.setItem("accessToken", `Bearer ${data.accessToken}`);
        document.location.href=`${BASE_URL}/articles`;

    } catch (errors) {
        alert("Invalid username / password");
    }

});
