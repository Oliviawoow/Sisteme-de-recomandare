// Import required modules
const fs = require('fs');
const Recombee = require('recombee-api-client');
const rqs = Recombee.requests;

// Initialize the Recombee client
const client = new Recombee.ApiClient(
  'oliviawoow-dev',
  'rpmhVI1rZ0XbbHVka1JdjItFbmgIQoxfaLBJ31gSx5EPTWCbN2vOLmiadhATXgjo'
);

// Test connection by resetting the database 
// client
//   .send(new rqs.ResetDatabase())
//   .then(() => console.log('Connection successful and database reset!'))
//   .catch(error => console.error('Connection failed:', error));

// Load and parse the fashion dataset JSON file
const data = JSON.parse(fs.readFileSync('fashion_data.json', 'utf-8'));

// Log the number of items loaded from the dataset
console.log(`Loaded ${data.length} items from the dataset.`);

// Set up item properties in Recombee
async function setupProperties() {
  try {
    // Define properties as required
    await client.send(new rqs.AddItemProperty("name", "string"));
    await client.send(new rqs.AddItemProperty("price", "double"));
    await client.send(new rqs.AddItemProperty("category", "string"));
    await client.send(new rqs.AddItemProperty("color", "string"));

    console.log('Properties have been set up successfully!');
  } catch (error) {
    console.error('Error setting up properties:', error);
  }
}

// Upload items to Recombee and set their values
async function uploadItems() {
  try {
    // Call setupProperties to ensure all properties are defined
    await setupProperties();

    // Add each item from the dataset to Recombee
    for (const item of data) {
      // Add the item to the database
      await client.send(new rqs.AddItem(item.itemId));

      // Set item values 
      await client.send(
        new rqs.SetItemValues(item.itemId, {
          name: item.name,
          price: item.price,
          category: item.category,
          color: item.color
        })
      );

      console.log(`Uploaded item: ${item.itemId} - ${item.name}`);
    }

    console.log('All items have been uploaded successfully!');
  } catch (error) {
    console.error('Error uploading items:', error);
  }
}

// Run the upload function
uploadItems();
