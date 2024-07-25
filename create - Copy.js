$(document).ready(function () {
    $('#category_1').select2({
        multiple: true
    });
});

let globaldata = []; // This will store the user data globally

domo.get("/domo/users/v1?includeDetails=true&limit=200").then(function (data) {
    console.log(data);

    globaldata = data; // Store the user data globally for later use

    let list1 = document.getElementById("category_1");

    data.forEach((user) => {
        let name = user.displayName;
        let option = document.createElement("option");
        option.textContent = name;
        option.value = user.email; // Store user's email as option value
        list1.appendChild(option);
    });
});

function create_team() {
    let select = document.getElementById("category_1");
    let selectedNames = [];

    // Loop through selected options to capture names
    for (let option of select.selectedOptions) {
        selectedNames.push(option.textContent.trim());
    }

    // Prepare an array of objects for selected users' emails and names
    let teamPeople = selectedNames.map((name) => {
        let selectedUser = globaldata.find(user => user.displayName === name);
        if (selectedUser && selectedUser.detail && selectedUser.detail.email) {
            return {
                email: selectedUser.detail.email,
                name: selectedUser.displayName
            };
        }
    }).filter(Boolean); // Filter out undefined values

    const payload = {
        content: {
            category_Role_2: {
                manage_ticket_category: select.value // Assuming you want the selected value of category_1
            },
            Team_people: {
                people: document.getElementById("category_2").value // Assuming you want the value of category_2
            },
            Team_people_email: {
                mail: teamPeople.map(user => user.email).join(', ')
            },
            Team_people_name: teamPeople
        }
    };

    console.log(payload); // Check payload structure in console

    // Example of posting data using fetch API (since domo.post is not recognized here)
    fetch(`/domo/datastores/v1/collections/ticket_team/documents/`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log("Data posted successfully:", data);
    })
    .catch(error => {
        console.error("Error posting data:", error);
    });
}
