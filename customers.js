document.body.onload = loadAllCustomers;

function populateEquipmentList(customersData) 
{
	const equipmentDropdown = document.getElementById("equipmentFilter");

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

function clearCustomerDivs() 
{
	const customersInfoDiv = document.getElementById("customersInfo");
	while (customersInfoDiv.firstChild) {
		customersInfoDiv.removeChild(customersInfoDiv.firstChild);
	}
}

function createCustomerDivs(customersData, equipmentFilter = null, memberFilter = null) 
{
	const customersInfoDiv = document.getElementById("customersInfo");

	for (const customer of customersData.customers) 
	{
		if (equipmentFilter) 
		{
			if (!customer.purchases.some(function (purchase) {
				return purchase.equipment === equipmentFilter
			})) 
			{
				continue;
			}
		}

		console.log(memberFilter);

		if (memberFilter) 
		{
			if (customer.loyaltyMember != memberFilter) 
			{
				continue;
			}
		}

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

async function applyFilterSelections()
{
	var equipmentValue = document.getElementById("equipmentFilter").value;
	var memberValue = document.getElementById("memberFilter").checked;

	const customersData = await retrieveCustomerData();

	clearCustomerDivs();
	createCustomerDivs(customersData, equipmentValue, memberValue)
}

async function loadAllCustomers() 
{
	const customersData = await retrieveCustomerData();
	populateEquipmentList(customersData);
	createCustomerDivs(customersData);
}

async function retrieveCustomerData()
{
	const request = new Request("customers.json");
	const response = await fetch(request);
  	const customersData = await response.json();
	return customersData;
}