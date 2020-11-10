<template>
	<v-app>
		<v-main>
			<v-container fill-height fluid fill-width>
				<v-row align="center" justify="center">
					<v-col>
						<h1 class="text-center">
							Coming soon
						</h1>
						<flip-countdown deadline="2020-11-13 20:00:00"></flip-countdown>
					</v-col>
				</v-row>
			</v-container>
		</v-main>
	</v-app>
</template>

<script>
import FlipCountdown from 'vue2-flip-countdown';

export default {
	name: 'App',

	components: {
		FlipCountdown,
	},

	data: () => ({
		//
	}),
};
</script>
