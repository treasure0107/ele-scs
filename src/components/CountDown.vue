<template>
    <span style="color:red">
			<template v-if="flag">
				<slot name="status" :flag="flag">0分0秒</slot>
			</template>
      <template v-else>
				<slot name="hour" :hours="hours" v-if="hours!='00'">{{hours}}时</slot><slot name="minute" :minutes="minutes" v-if="!(hours=='00'&&minutes=='00')">{{minutes}}分</slot><slot name="second" :seconds="seconds">{{seconds}}秒</slot>
			</template>
    </span>
</template>

<script>
	export default {
			name: 'CountDown',
			props: ['timeCountdown'], //接收秒数
			data() {
					return {
							time: this.timeCountdown,
							flag: false
					}
			},
			mounted() {
					let timer = () => {
							setTimeout(() => {
									this.time--;
									if (this.time <= 0) {
											this.flag = true;
											this.$emit('fnTimeOver')
									} else {
											timer();
									}
							}, 1000);
					};
					timer();
			},
			methods: {
				formate(num) {
					if (num >= 10) {
							return num
					} else {
							return `0${num}`
					}
				}
			},
			computed: {
					hours() {
						return this.formate(Math.floor(this.time / 60 / 60 % 24));
					},
					minutes() {
						return this.formate(Math.floor(this.time / 60 % 60));
					},
					seconds() {
						return this.formate(Math.floor(this.time % 60));
					}
			}
	}
</script>
