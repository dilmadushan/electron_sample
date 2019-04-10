let $ = require('jquery')  // jQuery now loaded and assigned to $

//DB Column Names sv Grid Headers map
var colNamesMap = {
	name: "Name", 
	age: "Age",
	description: "Description",
	latest: "Latest",
	col_1: "Column 1",
	col_2: "Column 2",
	col_3: "Column 3",
	col_4: "Column 4",
	col_5: "Column 5",
	col_6: "Column 6"
};

var columnDefs =  getColoumDefs(colNamesMap);
var grid = createGrid(columnDefs, []);
var myDB = createDB();
//feedDB(myDB);
feedColumnSelectorOptions(colNamesMap);

$('#current_button').on('click', () => {
	grid.destroy();
	
	myDB.find({ latest: '1'}, function(err, docs) {  
		grid = createGrid(columnDefs, docs);
		displaySelectedColumns();
	});
}) 

$('#history_button').on('click', () => {
	grid.destroy();
	
	myDB.find({ latest: '0'}, function(err, docs) {  
		grid = createGrid(columnDefs, docs);
		displaySelectedColumns();
	});
}) 

$('#ctrl_export_btn').on('click', () => {
	var params = {
        skipHeader: false,
        skipFooters: true,
        skipGroups: true,
        fileName: "export.csv"
    };
	grid.gridOptions.api.exportDataAsCsv(params);
}) 

$('#togle_display_columns').change(function() {
	displaySelectedColumns();
}) 

function createGrid (colDefs, data) {
	// let the grid know which columns and what data to use
	var gridOptions = {
	  columnDefs: colDefs,
	  rowData: data
	};

	// lookup the container we want the Grid to use
	var eGridDiv = document.querySelector('#grid_area');

	// create the grid passing in the div to use together with the columns & data we want to use
	return new agGrid.Grid(eGridDiv, gridOptions);
}

function createDB(){
	var Datastore = require('nedb');  
	var myDB = new Datastore({ filename: './DB/MyDB.db', autoload: true });
	return myDB;
} 

function getColoumDefs(columsMap) {
	var colDefs = [];
	
	Object.keys(columsMap).forEach(function(key) {
		var colDef = {headerName: columsMap[key], field: key};
		colDefs.push(colDef);
	});
	
	return colDefs;
}

function feedColumnSelectorOptions(columsMap) {
	
	var select = document.getElementById("togle_display_columns");
	
	Object.keys(columsMap).forEach(function(key) {
		var option = document.createElement("option");
		option.text = columsMap[key];
		option.value	= key;
		option.selected = true;
		select.add(option);
	});
};

//This returns the selected displaying columns
function getSelectedColumns() {
	var selectedColumns = [], opt;
	var select = document.getElementById("togle_display_columns");
    
    for (var i = 0; i < select.options.length; i++) {
        opt = select.options[i];
        
        if ( opt.selected ) {
            
            selectedColumns.push(opt.value);
        }
    }
    return selectedColumns;
};

function displaySelectedColumns() {
	//Hide all columns
	Object.keys(colNamesMap).forEach(function(key) {
		grid.gridOptions.columnApi.setColumnVisible(key, false);
	});
	
	var selectedColumns = getSelectedColumns();
	//Visible selected columns
	selectedColumns.forEach(function(col) {
		grid.gridOptions.columnApi.setColumnVisible(col, true);
	});
};

//Feed DB (This is a temp function for feeding DB)

function feedDB(db){
	
	db.ensureIndex({ fieldName: 'name', unique: true });
	
	var rowsArray = [];
	var insertRowCount = 1000;
	
	for (i = 0; i < insertRowCount; i++){
		var nameVal = "Alpha " + i;
		var dataRow = {
			name: nameVal,
			age: '20',
			description:'Current Data',
			col_1:'col 1',
			col_2:'col 2',
			col_3:'col 3',
			col_4:'col 4',
			col_5:'col 5',
			col_6:'col 6',
			latest:'1'
		};
		
		rowsArray.push(dataRow);
		
		nameVal = "Alpha " + (insertRowCount + i);
		
		dataRow = {
			name: nameVal,
			age: '20',
			description:'History Data',
			col_1:'col 1',
			col_2:'col 2',
			col_3:'col 3',
			col_4:'col 4',
			col_5:'col 5',
			col_6:'col 6',
			latest:'0'
		};
		
		rowsArray.push(dataRow);
	}
	
	db.insert(rowsArray, function(err, docs) {  
		docs.forEach(function(d) {
			console.log('Saved user:', d.name);
		});
	});
}