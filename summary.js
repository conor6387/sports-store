document.body.onload = calculateSummaryData();

function populateMonthlySalesTable(monthSalesArray, currentMonth) 
{
	const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

	const monthlySalesTable = document.getElementById("monthlySalesTableContent");

	let previousMonth;

	for (const date of monthSalesArray) 
	{
		const rowTemplate = document.querySelector("#monthlySalesTableRow");

		const templateClone = rowTemplate.content.cloneNode(true);

		const rowColumns = templateClone.querySelectorAll("td");

		if ((new Date(date[0])).getMonth() == currentMonth) 
		{
			for (column of rowColumns) 
			{
				column.className += "currentMonthHighlight";
			}
		}

		rowColumns[0].textContent = `${month[(new Date(date[0])).getMonth()]} ${(new Date(date[0])).getFullYear()}`;
		rowColumns[1].textContent = `${date[1]}`;

		let monthlyChange = (+date[1] - +previousMonth).toFixed(2);
		if (isNaN(monthlyChange)) 
		{
			monthlyChange = "-";
		}
		const positiveChangeChar = monthlyChange >= 0 ? "+" : ""; 
		rowColumns[2].textContent = `${positiveChangeChar}${monthlyChange}`;

		let monthlyPercentChange = ((+date[1] / +previousMonth - 1)*100).toFixed(2);
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
	const yearlySalesTable = document.getElementById("yearlySalesTableContent");

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

	var monthSalesDict = {};
	var previousYearTotal = 0;
	var currentYearTotal = 0;

	const currentYear = new Date().getFullYear();
	const currentMonth = new Date().getMonth();

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