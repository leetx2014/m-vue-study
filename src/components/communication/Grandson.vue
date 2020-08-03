<template>
  <div @click="$emit('some-event', 'msg from grandson')">
    <h3>Grandson</h3>
    <p>{{msg}}</p>
    <!-- 不定义 props 时，可用 $attrs 获取 -->
    <!-- <p>{{$attrs.msg}}</p> -->

    <!-- inject -->
    <p>{{'provide - inject: '}}{{foo1}}</p>
  </div>
</template>

<script>
export default {
  inject: {
    foo1 : {
      from: 'foo'
    }
  },
  props: {
    msg: {
      type: String,
      default: ''
    },
  },
};
</script>

<style lang="scss" scoped>

</style>