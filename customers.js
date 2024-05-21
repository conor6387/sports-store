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

function doesCustomerMatchFilterValues(customer, equipmentFilter, nameFilter, memberFilter) 
{
	if (equipmentFilter) 
	{
		if (!customer.purchases.some(function (purchase) {
			return purchase.equipment === equipmentFilter
		})) 
		{
			return false;
		}
	}

	if (nameFilter) 
	{
		const name = (`${customer.firstName} ${customer.lastName}`).toLowerCase();

		if (!name.includes(nameFilter.toLowerCase())) 
		{
			return false;
		}
	}

	if (memberFilter) 
	{
		if (customer.loyaltyMember != memberFilter) 
		{
			return false;
		}
	}

	return true;
}

function createCustomerDivs(customersData, equipmentFilter = null, nameFilter = null, memberFilter = null) 
{
	const customersInfoDiv = document.getElementById("customersInfo");

	for (const customer of customersData.customers) 
	{
		if (!doesCustomerMatchFilterValues(customer, equipmentFilter, nameFilter, memberFilter)) 
		{
			continue;
		}

		const customerList = document.createElement("ul");
		customerList.id = "customerList";

		const customerName = document.createTextNode(`Name: ${customer.firstName} ${customer.lastName}`);
		const customerMemberStatus = document.createTextNode(`Loyalty member: ${customer.loyaltyMember ? "Yes" : "No"}`);
		const customerPurchaseCount = document.createTextNode(`Number of purchases: ${customer.purchases.length}`);

		const customerNameListItem = document.createElement("li");
		customerNameListItem.id = "customerListItem";
		customerNameListItem.appendChild(customerName);

		const customerDialog = document.getElementById("customerDialog");
		customerNameListItem.addEventListener("click", () => {
			loadCustomerDialogData(customer.id);
			customerDialog.showModal();
		});

		const closeButton = document.getElementById("dialogCloseButton");
		closeButton.addEventListener("click", () => {
			customerDialog.close();
		});

		const customerMemberStatusListItem = document.createElement("li");
		customerMemberStatusListItem.id = "customerListItem";
		customerMemberStatusListItem.appendChild(customerMemberStatus);

		const customerPurchaseCountListItem = document.createElement("li");
		customerPurchaseCountListItem.id = "customerListItem";
		customerPurchaseCountListItem.appendChild(customerPurchaseCount);

		customerList.appendChild(customerNameListItem);
		customerList.appendChild(customerMemberStatusListItem);
		customerList.appendChild(customerPurchaseCountListItem);

		customersInfoDiv.appendChild(customerList);
	}
}

function clearCustomerDialog() 
{
	const customersDialogDiv = document.getElementById("customerDialogInfoDiv");
	while (customersDialogDiv.firstChild) {
		customersDialogDiv.removeChild(customersDialogDiv.firstChild);
	}
}

async function loadCustomerDialogData(Id) 
{
	clearCustomerDialog();

	const customersData = await retrieveCustomerData();

	const customer = customersData.customers.find((customer) => customer.id == Id);

	const customerDialogInfoDiv = document.getElementById("customerDialogInfoDiv");

	const customerElementsList = [];

	customerElementsList.push(document.createTextNode(`Id: ${Id}`));
	customerElementsList.push(document.createTextNode(`First name: ${customer.firstName}`));
	customerElementsList.push(document.createTextNode(`Last name: ${customer.lastName}`));
	customerElementsList.push(document.createTextNode(`Email: ${customer.email}`));
	customerElementsList.push(document.createTextNode(`Loyalty member: ${(customer.loyaltyMember ? "Yes" : "No")}`));

	for (const text of customerElementsList) 
	{
		const element = document.createElement("p");
		element.appendChild(text);

		customerDialogInfoDiv.appendChild(element);
	}

	const purchaseList = document.createElement("ul");
	var totalSpent = 0;

	for (const purchase of customer.purchases) 
	{
		totalSpent += +purchase.cost;

		const equipmentPurchased = document.createTextNode(purchase.equipment);

		const purchaseListItem = document.createElement("li");
		purchaseListItem.appendChild(equipmentPurchased);

		purchaseList.appendChild(purchaseListItem);
	}

	const customerPurchases = document.createTextNode("Purchases:");
	const customerPurchasesElement = document.createElement("p");
	customerPurchasesElement.appendChild(customerPurchases);

	customerDialogInfoDiv.appendChild(customerPurchasesElement);
	customerDialogInfoDiv.appendChild(purchaseList);

	totalSpent = totalSpent.toFixed(2);

	const customerSpend = document.createTextNode("Total spent: $" + totalSpent);

	const customerSpendElement = document.createElement("p");
	customerSpendElement.appendChild(customerSpend);

	customerDialogInfoDiv.appendChild(customerSpendElement);
}

async function updateFilterSelections()
{
	var equipmentValue = document.getElementById("equipmentFilter").value;
	var nameValue = document.getElementById("customerNameFilter").value;
	var memberValue = document.getElementById("memberFilter").checked;

	const customersData = await retrieveCustomerData();

	clearCustomerDivs();
	createCustomerDivs(customersData, equipmentValue, nameValue, memberValue)
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