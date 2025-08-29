<script lang="ts">
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';

	interface Props {
		paths: Array<any>;
		tableName: string;
		showCount?: boolean;
	}

	let { paths, tableName, showCount = true }: Props = $props();

	function navFromTo(navFrom: string, navTo: string) {
		goto(resolve('/loading', {})).then(() =>
			goto(resolve('/map/[navFrom]/[navTo]', { navFrom: navFrom, navTo: navTo }), {
				replaceState: true
			})
		);
	}
</script>

{#if paths.length > 0}
	<div class="overflow-x-auto">
		<h2 class="max-sm:text-center text-xl">{tableName}</h2>
		<table class="table table-sm md:table-md">
			<thead>
				<tr class="text-md md:text-xl">
					<th>Začátek cesty</th>
					<th>Konec cesty</th>
					{#if showCount}
						<th>Použití</th>
					{/if}
				</tr>
			</thead>
			<tbody>
				{#each paths as path}
					{#if !path.hidden}
						<tr class="hover text-md md:text-xl">
							<td>{path.start_name}</td>
							<td>{path.end_name}</td>
							{#if showCount}
								<td>{path.count}</td>
							{/if}
							<td>
								<button
									onclick={() => {
										navFromTo(path.start_node, path.end_node);
									}}
									class="btn btn-secondary hover:text-primary hover:bg-base-100"
								>
									Navigovat
								</button>
							</td>
						</tr>
					{/if}
				{/each}
			</tbody>
		</table>
	</div>
{/if}
