<!doctype html>
<html>
<head>
<meta charset="UTF-8" />
<title>Visual unicode fuzzer</title>
<style>
.parent {
  position: absolute;
  height: 50%;
  width: 50%;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -moz-transform:    translateY(-50%);
  -ms-transform:     translateY(-50%);
  -o-transform:      translateY(-50%);
  transform:         translateY(-50%);
}
.fuzz {
	height: 300px;
  width:5000px;
	position: relative;
  left:50%;
	top: 50%;
	transform: translateY(-50%);
}
</style>
</head>
<body>
<div class="parent">
  <div class="fuzz" id="test"></div>
</div>
<script>
var chars = location.search.slice(1).split(',');
if(chars.length > 1) {
  document.getElementById('test').innerHTML = String.fromCharCode(chars[0])+String.fromCharCode(chars[1]).repeat(100);
} else {
  document.getElementById('test').innerHTML = String.fromCharCode(chars[0]).repeat(100);
}
</script>
</body>
</html>
