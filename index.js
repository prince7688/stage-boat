const container = document.getElementById("containerEle");

const { DoppleXR } = await import(
	"https://builds.dopple.io/packages/dopple-sdk@rc/dopple-sdk.js"
);

const dopple = new DoppleXR({
	container,
	selection: {},
	productVersion: 2,
	owner: "dopple",
	workspace: "bill-company-ws",
	projectName: "arrow-boat-fixed-2",
	logNamespace: "sdk",
	sessionId: "1",
});

await dopple.load();

const selected = Object.entries(dopple.matrix.choices).reduce(
	(acc, [key, value]) => {
		acc[key] = Object.keys(value.options)[0];
		return acc;
	},

	{},
);

await dopple.updateSelection(selected);

dopple.resize({ trackParentSize: true });

dopple.run();

{
	function getChoices() {
		return Object.keys(dopple.matrix.choices);
	}

	function getOptions(name) {
		return Object.keys(dopple.matrix.choices[name].options);
	}

	function createDropdown(name) {
		const select = document.createElement("select");
		select.name = name;

		const options = getOptions(name);

		for (const option of options) {
			const opt = document.createElement("option");
			opt.value = option;
			opt.textContent = option;
			option === selected[name] && opt.setAttribute("selected", "selected");
			select.appendChild(opt);
		}

		select.addEventListener("change", handleSelectionChange);

		return select;
	}

	async function handleSelectionChange(event) {
		const selectedValue = event.target.value;
		selected[event.target.name] = selectedValue;
		console.log("Selection changed to:", selectedValue);

		await dopple.updateSelection(selected);
	}

	function populateChoices() {
		const choicesList = document.getElementById("choicesList");
		const choices = getChoices();

		for (const choice of choices) {
			const li = document.createElement("li");
			li.textContent = `${choice}: `;
			li.id = "list-group-item";

			const dropdown = createDropdown(choice);
			li.appendChild(dropdown);

			choicesList.appendChild(li);
		}
	}

	populateChoices();
}
