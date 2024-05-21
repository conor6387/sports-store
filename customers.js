document.body.onload = loadCustomers;

function populateEquipmentList(customersData) 
{
	const equipmentDropdown = document.getElementById("equipmentSearch");

	const equipmentArray = [];

	for (const customer of customersData.customers) 
	{
		for (const purchase of customer.purchases)
		{
			if (!equipmentArray.includes(purchase.equipment))
			{
				equipmentArray.push(purchase.equipment)
			}
		}
	}

	for (const equipment of equipmentArray) 
	{
		const equipmentOption = document.createElement("option");

		equipmentOption.innerText = equipment;

		equipmentDropdown.appendChild(equipmentOption)
	}
}

function createCustomerDivs(customersData) 
{
	const customersInfoDiv = document.getElementById("customersInfo");

	for (const customer of customersData.customers) 
	{
		const customerList = document.createElement("ul");

		const customerName = document.createTextNode("Name: " + customer.firstName + " " + customer.lastName);
		const customerMemberStatus = document.createTextNode("Loyalty member: " + (customer.loyaltyMember ? "Yes" : "No"));
		const customerPurchaseCount = document.createTextNode("Number of purchases: " + customer.purchases.length);

		const customerNameListItem = document.createElement("li");
		customerNameListItem.appendChild(customerName);

		const customerMemberStatusListItem = document.createElement("li");
		customerMemberStatusListItem.appendChild(customerMemberStatus);

		const customerPurchaseCountListItem = document.createElement("li");
		customerPurchaseCountListItem.appendChild(customerPurchaseCount);

		customerList.appendChild(customerNameListItem);
		customerList.appendChild(customerMemberStatusListItem);
		customerList.appendChild(customerPurchaseCountListItem);

		customersInfoDiv.appendChild(customerList);
	}
}

async function loadCustomers() {
	const request = new Request("customers.json");
	const response = await fetch(request);
  	const customersData = await response.json();
	populateEquipmentList(customersData);
	createCustomerDivs(customersData);
}