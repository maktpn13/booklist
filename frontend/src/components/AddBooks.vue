<template>
  <div>
    <h1>Hello {{ fname }} {{ lname }} {{ value }}</h1>
    <button @click="hello">Emit for spicific</button>
    <button @click="helloWorld">emit</button>
    <button @click="$emit('change-fname', 'helloooo')">Change name</button>
  </div>
</template>

<script>
export default {
  props: ["fname", "lname", "value"],
  methods: {
    hello() {
      this.$emit("input", "hi");
    },
    helloWorld() {
      this.$emit("input", this.value + 1);
    }
  },
  beforeMount() {
    console.log("hello", this.value);
  }
};
</script>
