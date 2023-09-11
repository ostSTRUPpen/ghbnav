<script lang="ts">
	import { startingPoint, endingPoint, foundpath } from '$lib/data/store';

	//$: {
	//	startingPoint.subscribe((value) => console.log('StaritngPoint using $:' + value));
	//}
	//$: {
	//	endingPoint.subscribe((value) => console.log('EndingPoint using $:' + value));
	//}
	//$: {
	//	foundpath.subscribe((value) => console.log('FoundPath using $:' + value));
	//}
	startingPoint.subscribe((value) => console.log('StaritngPoint using sub' + value));
	endingPoint.subscribe((value) => console.log('EndingPoint using sub' + value));
	foundpath.subscribe((value) => console.log('FoundPath using sub' + value));
</script>
