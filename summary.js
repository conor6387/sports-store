document.body.onload = loadSummaryData;

async function loadSummaryData()
{
	const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

	const customersData = await retrieveCustomerData();

	var monthSalesDict = {};
	var previousYearTotal = 0;
	var currentYearTotal = 0;

	const currentYear = new Date().getFullYear();

	for (const customer of customersData.customers) 
	{
		for (const purchase of customer.purchases) 
		{
			const dateKey = new Date(purchase.year, purchase.month);
			
			if (dateKey in monthSalesDict) 
			{
				monthSalesDict[dateKey] = (+monthSalesDict[dateKey] + +purchase.cost).toFixed(2);
			}
			else 
			{
				monthSalesDict[dateKey] = purchase.cost;
			}

			if (purchase.year == currentYear) {
				currentYearTotal = (+currentYearTotal + +purchase.cost).toFixed(2);
			}

			if (purchase.year == currentYear - 1) {
				previousYearTotal = (+previousYearTotal + +purchase.cost).toFixed(2);
			}
		}
	}

	var monthSalesArray = Object.keys(monthSalesDict).map(function(key) {
		return [key, monthSalesDict[key]];
	});
	
	monthSalesArray.sort(function(a, b) {
		return new Date(a[0]) - new Date(b[0]);
	});

	const monthlySalesTable = document.getElementById("monthlySalesTableContent");

	let previousMonth;

	for (const date of monthSalesArray) 
	{
		const rowTemplate = document.querySelector("#monthlySalesTableRow");

		const templateClone = rowTemplate.content.cloneNode(true);

		const rowColumns = templateClone.querySelectorAll("td");

		rowColumns[0].textContent = `${month[(new Date(date[0])).getMonth()]} ${(new Date(date[0])).getFullYear()}`;
		rowColumns[1].textContent = `${date[1]}`;
		rowColumns[2].textContent = `${(+date[1] - +previousMonth).toFixed(2)}`;

		monthlySalesTable.appendChild(templateClone);

		previousMonth = date[1];
	}

	const yearlySalesTable = document.getElementById("yearlySalesTableContent");

	const yearlyTableColumns = yearlySalesTable.querySelectorAll("td");

	yearlyTableColumns[0].textContent = `${currentYearTotal}`;
	yearlyTableColumns[1].textContent = `${previousYearTotal}`;
	yearlyTableColumns[2].textContent = `${(currentYearTotal - previousYearTotal).toFixed(2)}`;
}

async function retrieveCustomerData()
{
	const request = new Request("customers.json");
	const response = await fetch(request);
  	const customersData = await response.json();
	return customersData;
}