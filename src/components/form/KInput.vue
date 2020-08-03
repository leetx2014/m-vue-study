<template>
  <div>
    <input :type="type" :value="value" @input="onInput" v-bind="$attrs">
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    type: {
      type: String,
      default: 'text'
    },
    value: {
      type: String,
      default: ''
    }
  },
  methods: {
    onInput(e) {
      console.log('e.target.value', e.target.value);
      this.$emit('input', e.target.value);

      // 触发校验
      this.$parent.$emit('validate');
    }
  },
};
</script>

<style lang="scss" scoped>

</style>