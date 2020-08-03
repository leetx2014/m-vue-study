<template>
  <div @click="$emit('some-event', 'msg from child1')">
    <h3>Child1</h3>
    <!-- props -->
    <p>{{msg}}</p>
  </div>
</template>

<script>
export default {
  props: {
    msg: {
      type: String,
      default: ''
    }
  },
  mounted () {
    // 利用事件总线监听事件
    this.$bus.$on('event-from-child2', msg => {
      console.log('Child1: ', msg);
    });
  },
};
</script>

<style lang="scss" scoped>

</style>