document.body.onload = loadCustomers;

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
	createCustomerDivs(customersData);
}