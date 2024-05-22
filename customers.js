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

		equipmentOption.textContent = equipment;

		equipmentDropdown.appendChild(equipmentOption)
	}
}

function clearCustomerDivs() 
{
	const customersInfoDiv = document.getElementById("customersInfo");
	while (customersInfoDiv.lastChild) {
		if (customersInfoDiv.lastChild.nodeName == "TEMPLATE") 
		{ 
			break; 
		}
		customersInfoDiv.removeChild(customersInfoDiv.lastChild);
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

		const listTemplate = document.querySelector("#customerListTemplate");

		const templateClone = listTemplate.content.cloneNode(true);

		const listItems = templateClone.querySelectorAll("#customerListItem");

		listItems[0].textContent = `Name: ${customer.firstName} ${customer.lastName}`;
		listItems[1].textContent = `Loyalty member: ${customer.loyaltyMember ? "Yes" : "No"}`;
		listItems[2].textContent = `Number of purchases: ${customer.purchases.length}`;

		customersInfoDiv.appendChild(templateClone);

		const customerDialog = document.getElementById("customerDialog");
		listItems[0].addEventListener("click", () => {
			loadCustomerDialogData(customer.id);
			customerDialog.showModal();
		});

		const closeButton = document.getElementById("dialogCloseButton");
		closeButton.addEventListener("click", () => {
			customerDialog.close();
		});
	}
}

function clearCustomerDialog() 
{
	const customerElementsList = customerDialogInfoDiv.querySelectorAll("#customerDialogTextItem");

	for (let i = 0; i < customerElementsList.length; i++)
	{
		customerElementsList[i].textContent = "";
	}

	const customersDialogPurchaseList = document.getElementById("customerDialogPurchaseList");
	while (customersDialogPurchaseList.firstChild) {
		customersDialogPurchaseList.removeChild(customersDialogPurchaseList.firstChild);
	}
}

async function loadCustomerDialogData(Id) 
{
	clearCustomerDialog();

	const customersData = await retrieveCustomerData();

	const customer = customersData.customers.find((customer) => customer.id == Id);

	const customerDialogInfoDiv = document.getElementById("customerDialogInfoDiv");

	const customerElementsList = customerDialogInfoDiv.querySelectorAll("#customerDialogTextItem");

	customerElementsList[0].textContent = `Id: ${Id}`;
	customerElementsList[1].textContent = `First name: ${customer.firstName}`;
	customerElementsList[2].textContent = `Last name: ${customer.lastName}`;
	customerElementsList[3].textContent = `Email: ${customer.email}`;
	customerElementsList[4].textContent = `Loyalty member: ${(customer.loyaltyMember ? "Yes" : "No")}`;
	customerElementsList[5].textContent = "Purchases:";

	const purchaseList = document.getElementById("customerDialogPurchaseList");

	var totalSpent = 0;

	for (const purchase of customer.purchases) 
	{
		totalSpent += +purchase.cost;

		const equipmentPurchased = document.createTextNode(purchase.equipment);

		const purchaseListItem = document.createElement("li");
		purchaseListItem.appendChild(equipmentPurchased);

		purchaseList.appendChild(purchaseListItem);
	}

	totalSpent = totalSpent.toFixed(2);
	customerElementsList[6].textContent = `Total spent: $${totalSpent}`;
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