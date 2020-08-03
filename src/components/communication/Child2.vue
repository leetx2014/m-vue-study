<template>
  <div>
    <h3>Child2</h3>
    <!-- $attr -->
    <p>{{$attrs.msg}}</p>
    <!-- 隔代传参,v-bind会展开$attrs -->
    <Grandson v-bind="$attrs" v-on="$listeners" />
    <button @click="sendToChild1">点我给child1发消息</button>
  </div>
</template>

<script>
import Grandson from '@/components/communication/Grandson.vue';

export default {
  components: {
    Grandson,
  },
  methods: {
    sendToChild1() {
      // 利用事件总线发送事件
      this.$bus.$emit('event-from-child2', 'some msg from child2');
    }
  },
};
</script>

<style lang="scss" scoped>

</style>