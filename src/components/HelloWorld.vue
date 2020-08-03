<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <!-- 组件通信 -->
    <!-- <Communication></Communication> -->

    <!-- 插槽 -->
    <!-- <SlotExample></SlotExample> -->

    <!-- 递归 -->
    <!-- <TreeExample></TreeExample> -->

    <!-- 表单 -->
    <FormExample></FormExample>
  </div>
</template>

<script>
import Communication from '@/components/communication';
import SlotExample from '@/components/slots';
import TreeExample from '@/components/recursion';
import FormExample from '@/components/form';


export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  components: {
    Communication,
    SlotExample,
    TreeExample,
    FormExample
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
