<script lang="ts">
	import { startingPoint, endingPoint, foundPath } from '$lib/data/store';

	//$: {
	//	startingPoint.subscribe((value) => console.log('StaritngPoint using $:' + value));
	//}
	//$: {
	//	endingPoint.subscribe((value) => console.log('EndingPoint using $:' + value));
	//}
	//$: {
	//	foundPath.subscribe((value) => console.log('foundPath using $:' + value));
	//}
	startingPoint.subscribe((value) => console.log('StaritngPoint using sub' + value));
	endingPoint.subscribe((value) => console.log('EndingPoint using sub' + value));
	foundPath.subscribe((value) => console.log('foundPath using sub' + value));
</script>
