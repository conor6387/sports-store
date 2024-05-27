document.body.onload = loadAllCustomers();

function populateEquipmentList(customersData) 
{
	const equipmentDropdown = document.getElementById("equipment-filter");

	const equipmentArray = [];

	for (const customer of customersData.customers) 
	{
		for (const purchase of customer.purchases)
		{
			if (!equipmentArray.includes(purchase.equipment))
			{
				equipmentArray.push(purchase.equipment);
			}
		}
	}

	for (const equipment of equipmentArray) 
	{
		const equipmentOption = document.createElement("option");

		equipmentOption.textContent = equipment;

		equipmentDropdown.appendChild(equipmentOption);
	}
}

function clearCustomerDivs() 
{
	const customersInfoDiv = document.getElementById("customers-info");
	while (customersInfoDiv.lastChild) {
		if (customersInfoDiv.lastChild.nodeName === "TEMPLATE") 
		{ 
			break; 
		}
		customersInfoDiv.removeChild(customersInfoDiv.lastChild);
	}
}

function doesCustomerMatchFilterValues(customer, equipmentFilter, nameFilter, memberFilter) 
{
	if (equipmentFilter && !customer.purchases.some(function (purchase) { return purchase.equipment === equipmentFilter; })) return false;

	if (nameFilter) 
	{
		const name = (`${customer.firstName} ${customer.lastName}`).toLowerCase();

		if (!name.includes(nameFilter.toLowerCase())) return false;
	}

	if (memberFilter && customer.loyaltyMember !== memberFilter) return false;

	return true;
}

function createCustomerDivs(customersData, equipmentFilter = null, nameFilter = null, memberFilter = null) 
{
	const customersInfoDiv = document.getElementById("customers-info");

	for (const customer of customersData.customers) 
	{
		if (!doesCustomerMatchFilterValues(customer, equipmentFilter, nameFilter, memberFilter)) 
		{
			continue;
		}

		const listTemplate = document.querySelector(".customer-list-template");

		const templateClone = listTemplate.content.cloneNode(true);

		const listItems = templateClone.querySelectorAll(".customer-list-item");

		listItems[0].textContent = `Name: ${customer.firstName} ${customer.lastName}`;
		listItems[1].textContent = `Loyalty member: ${customer.loyaltyMember ? "Yes" : "No"}`;
		listItems[2].textContent = `Number of purchases: ${customer.purchases.length}`;

		customersInfoDiv.appendChild(templateClone);

		const customerDialog = document.getElementById("customer-dialog");
		listItems[0].addEventListener("click", () => {
			loadCustomerDialogData(customer.id);
			customerDialog.showModal();
		});

		const closeButton = document.getElementById("dialog-close-button");
		closeButton.addEventListener("click", () => {
			customerDialog.close();
		});
	}
}

function clearCustomerDialog(customerDialogInfoDiv) 
{
	const customerElementsList = customerDialogInfoDiv.querySelectorAll("#customer-dialog-text-item");

	for (let i = 0; i < customerElementsList.length; i++)
	{
		customerElementsList[i].textContent = "";
	}

	const customersDialogPurchaseList = document.getElementById("customer-dialog-purchase-list");
	while (customersDialogPurchaseList.firstChild) {
		customersDialogPurchaseList.removeChild(customersDialogPurchaseList.firstChild);
	}
}

async function loadCustomerDialogData(Id) 
{
	const customerDialogInfoDiv = document.getElementById("customer-dialog-info-div");

	clearCustomerDialog(customerDialogInfoDiv);

	const customersData = await retrieveCustomerData();

	const customer = customersData.customers.find((customer) => customer.id === Id);

	const customerElementsList = customerDialogInfoDiv.querySelectorAll(".customer-dialog-text-item");

	customerElementsList[0].textContent = `Id: ${Id}`;
	customerElementsList[1].textContent = `First name: ${customer.firstName}`;
	customerElementsList[2].textContent = `Last name: ${customer.lastName}`;
	customerElementsList[3].textContent = `Email: ${customer.email}`;
	customerElementsList[4].textContent = `Loyalty member: ${(customer.loyaltyMember ? "Yes" : "No")}`;
	customerElementsList[5].textContent = "Purchases:";

	const purchaseList = document.getElementById("customer-dialog-purchase-list");

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
	var equipmentValue = document.getElementById("equipment-filter").value;
	var nameValue = document.getElementById("customer-name-filter").value;
	var memberValue = document.getElementById("member-filter").checked;

	const customersData = await retrieveCustomerData();

	clearCustomerDivs();
	createCustomerDivs(customersData, equipmentValue, nameValue, memberValue);
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