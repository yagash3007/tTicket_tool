domo
  .get(`/domo/datastores/v1/collections/ticket_team/documents/`)
  .then((data) => console.log(data));



domo.get("/domo/datastores/v1/collections/ticket_team/documents/").then(function (data) {
  console.log(data);

  let list1 = document.getElementById("category");
  let list2 = list1.value;
  console.log(list2);

  data.forEach((team) => {
    let name = team.content.Team_people.people;
    let option = document.createElement("option");
    option.textContent = name;
    option.value = name;

    list1.appendChild(option);
  });
  
});


function email(category){
  console.log("ADJAISJDIOASJDIAJSDOIAJSDOIAJSDIJAIDJAOSDJ");
  
   // Fetching data from ticket_team collection to get email addresses
      domo.get("/domo/datastores/v1/collections/ticket_team/documents/")
        .then((response) => {
          console.log('sdfsdfsdffffffffffffffffffff',response);

          let emails = [];

          // Filtering records based on category
          console.log(emails)
          const filteredRecords = response.filter(record => record.content.Team_people.people === category);

          // Extracting emails from filtered records
          filteredRecords.forEach(record => {
            record.content.Team_people_name.forEach(member => {
              emails.push(member.email);
            });
          });

          console.log("Emails:", emails);

          // Further processing with the emails can be done here
          // For example, sending emails or performing other actions

        })
        .catch((error) => {
          console.error("Error fetching data from ticket_team:", error);
        });
}

function sub() {
  let category = document.getElementById("category").value;
  let subject = document.getElementById("subject").value;
  let description = document.getElementById("description").value;
  let myid = domo.env.userId; // Assuming domo is defined somewhere else

  const payload = {
    content: {
      category_Role: {
        category: category ? category : "dummy",
      },
      Requester: {
        user_id: myid ? myid : "dummy",
      },
      Subject: {
        subject: subject ? subject : "dummy",
      },
      Description: {
        description: description ? description : "dummy",
      },
      category_Role_2: {
        manage_ticket_category: category ? category : "dummy",
      },
      Team_people: {
        people: team ? team : "dummy",
      },
    },
  };

  console.log(payload);

  // Posting data to ticket_tool collection
  domo.post(`/domo/datastores/v1/collections/ticket_tool/documents/`, payload)
    .then((data) => {
      console.log("Data posted successfully:", data);
      email(category)

     
    })
    .catch((error) => {
      console.error("Error posting data to ticket_tool:", error);
    });
}


// function SendEmail(to,body) {

//   console.log("Sending Email to ====>", to);

//   const startWorkflow = (alias, data) => {
//     return new Promise((resolve, reject) => {
//       domo.post(`/domo/workflow/v1/models/${alias}/start`, data)
//         .then(response => {
//           console.log(response);
//         })
//         .catch(error => {
//           console.log(error);
//         });
//     });
//   };

//   startWorkflow("send_email", { to: to, subject: 'Summa tha ', body: body })
//     .then(response => {
//       console.log("Workflow started successfully:", response);
//       document.getElementById('test').textContent = 'True';
//     })
//     .catch(error => {
//       console.error("Error starting workflow:", error);
     
//     });
// }