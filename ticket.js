function handledelete(id) {
    var xhr = new XMLHttpRequest();
    xhr.open('DELETE', `/domo/datastores/v1/collections/ticket_tool/documents/${id}`, true);
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            console.log(`Document with ID ${id} deleted successfully.`);
            // Optionally, update UI or reload data after deletion
        } else {
            console.error(`Failed to delete document with ID ${id}.`);
        }
    };
    xhr.onerror = function() {
        console.error('Error deleting document:', xhr.statusText);
    };
    xhr.send();
}



