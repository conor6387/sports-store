document.body.onload = calculateSummaryData();

function populateMonthlySalesTable(monthSalesArray, currentMonth) 
{
	const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

	const monthlySalesTable = document.getElementById("monthly-sales-table-content");

	let previousMonth;

	for (const date of monthSalesArray) 
	{
		const rowTemplate = document.querySelector(".monthly-sales-table-row");

		const templateClone = rowTemplate.content.cloneNode(true);

		const rowColumns = templateClone.querySelectorAll("td");

		if ((new Date(date[0])).getMonth() === currentMonth) 
		{
			for (column of rowColumns) 
			{
				column.classList.add("current-month-highlight");
			}
		}

		rowColumns[0].textContent = `${month[(new Date(date[0])).getMonth()]} ${(new Date(date[0])).getFullYear()}`;
		rowColumns[1].textContent = `${date[1]}`;

		let monthlyChange = (date[1] - previousMonth).toFixed(2);
		if (isNaN(monthlyChange)) 
		{
			monthlyChange = "-";
		}
		const positiveChangeChar = monthlyChange >= 0 ? "+" : ""; 
		rowColumns[2].textContent = `${positiveChangeChar}${monthlyChange}`;

		let monthlyPercentChange = ((date[1] / previousMonth - 1)*100).toFixed(2);
		if (isNaN(monthlyPercentChange)) 
		{
			monthlyPercentChange = "-";
		}
		rowColumns[3].textContent = `${positiveChangeChar}${monthlyPercentChange}`;

		monthlySalesTable.appendChild(templateClone);

		previousMonth = date[1];
	}
}

function populateYearlySalesTable(previousYearTotal, currentYearTotal) 
{
	const yearlySalesTable = document.getElementById("yearly-sales-table-content");

	const yearlyTableColumns = yearlySalesTable.querySelectorAll("td");

	yearlyTableColumns[0].textContent = `${currentYearTotal}`;
	yearlyTableColumns[1].textContent = `${previousYearTotal}`;

	const yearlyChange = (currentYearTotal - previousYearTotal).toFixed(2);
	const positiveChangeChar = yearlyChange >= 0 ? "+" : "";
	yearlyTableColumns[2].textContent = `${positiveChangeChar}${yearlyChange}`;

	const yearlyPercentChange = ((currentYearTotal / previousYearTotal - 1)*100).toFixed(2);
	yearlyTableColumns[3].textContent = `${positiveChangeChar}${yearlyPercentChange}`;
}

async function calculateSummaryData()
{
	const customersData = await retrieveCustomerData();

	let monthSalesDict = {};
	let previousYearTotal = 0;
	let currentYearTotal = 0;

	const currentYear = new Date().getFullYear();
	const currentMonth = new Date().getMonth();

	for (const customer of customersData.customers) 
	{
		for (const purchase of customer.purchases) 
		{
			const dateKey = new Date(purchase.timestamp);
			const purchaseYear = dateKey.getFullYear();

			monthSalesDict[dateKey] = dateKey in monthSalesDict ? (+monthSalesDict[dateKey] + +purchase.cost).toFixed(2) : purchase.cost;

			if (purchaseYear === currentYear) {
				const currTotal = +currentYearTotal;
				const cost = +purchase.cost;
				currentYearTotal = (currTotal + cost).toFixed(2);
			}

			if (purchaseYear === currentYear - 1) {
				const prevTotal = +previousYearTotal;
				const cost = +purchase.cost;
				previousYearTotal = (prevTotal + cost).toFixed(2);
			}
		}
	}

	let monthSalesArray = Object.keys(monthSalesDict).map(function(key) {
		return [key, monthSalesDict[key]];
	});
	
	monthSalesArray.sort(function(a, b) {
		return new Date(a[0]) - new Date(b[0]);
	});

	populateMonthlySalesTable(monthSalesArray, currentMonth);
	populateYearlySalesTable(previousYearTotal, currentYearTotal);
}

async function retrieveCustomerData()
{
	const request = new Request("customers.json");
	const response = await fetch(request);
  	const customersData = await response.json();
	return customersData;
}