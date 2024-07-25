$(document).ready(function() {
    fetch("/domo/datastores/v1/collections/ticket_team/documents/")
        .then(response => response.json())
        .then(data => {
            console.log(data);
            
            const tableBody = document.querySelector(".responsive-table");
            let serialNumber = 1;

            data.forEach(item => {
                const teamName = item.content.Team_people.people; // Update to use category_Role_2.manage_ticket_category
                const teamMembers = item.content.Team_people_name.map(member => member.name).join(', ');
            
                const row = document.createElement("li");
                row.classList.add("table-row");
            
                const serialCell = document.createElement("div");
                serialCell.classList.add("col", "col-1");
                serialCell.textContent = serialNumber++;
                row.appendChild(serialCell);
            
                const teamNameCell = document.createElement("div");
                teamNameCell.classList.add("col", "col-2");
                teamNameCell.textContent = teamName;
                teamNameCell.setAttribute("contenteditable", "true");
                row.appendChild(teamNameCell);
            
                const teamMembersCell = document.createElement("div");
                teamMembersCell.classList.add("col", "col-3");
                teamMembersCell.textContent = teamMembers;
                row.appendChild(teamMembersCell);
            
                const editButton = document.createElement("button");
                editButton.textContent = "Edit";
                editButton.classList.add("edit-button");
                editButton.setAttribute("onclick", `handleedit('${item.id}')`);
                row.appendChild(editButton);
            
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.classList.add("delete-button");
                deleteButton.setAttribute("onclick", `handledelete('${item.id}')`);
                row.appendChild(deleteButton);
            
                tableBody.appendChild(row);
            });
            
        })
        .catch(error => console.error(error));
    domo.get("/domo/users/v1?includeDetails=true&limit=200")
        .then(function(data) {
            let list1 = document.getElementById("category_1");

            data.forEach(user => {
                let name = user.displayName;
                let option = document.createElement('option');
                option.textContent = name;
                option.value = name;
                list1.appendChild(option);
            });

            // Initialize Select2 after options are added
            $("#category_1").select2({
                multiple: true,
            });
        })
        .catch(error => {
            console.error("Error fetching user data:", error);
        });
});

function handleedit(id) {
    domo.get(`/domo/datastores/v1/collections/ticket_team/documents/${id}`)
        .then(data => {
            let existingData = data.content;
            document.getElementById('id').value=id
            $("#editForm").show();
            $("#category_1").select2({
                multiple: true,
            });
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });


}
$("#edit").submit(function(e) {
    e.preventDefault();
    let id = document.getElementById('id').value;

    domo.get(`/domo/datastores/v1/collections/ticket_team/documents/${id}`)
    .then(data => {
        let existingData = data; 
        let selectedTeams = $('#category_1').val() || []; 
        existingData.content.category_Role_2 = {
            mange_ticket_category: selectedTeams  
        };
        existingData.content.Team_people = {
            people: $('#category_2').val()
        };

        console.log(existingData);
        

        // Perform the PUT request to update the document in the datastore
        domo.put(`/domo/datastores/v1/collections/ticket_team/documents/${id}`, existingData)
        .then(response => {
            console.log("Data updated successfully:", response);
        })
        .catch(error => {
            console.error("Error updating data:", error);
        });
    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });
});

function handledelete(id){
    domo.delete(`/domo/datastores/v1/collections/ticket_team/documents/${id}`)
    .then(response => {
        console.log("deleted",response)
    })
    
}




