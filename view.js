let $ = require('jquery')  // jQuery now loaded and assigned to $
let count = 0
$('#click-counter').text(count.toString())

$('#countbtn').on('click', () => {
   count ++ 
   $('#click-counter').text(count)
}) 

$('#characters-count').text("0")
$('#text-editor').on('change keyup paste', () => {
	$('#characters-count').text($('#text-editor').val().length)
})


