<template>
  <div class="desc secondary--text">
    <div class="headline">{{ title }}</div>
    <div class="body-2 mb-5">
      {{ description }}
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'SimHeader',
  props: {
    title: { required: true, type: String },
    description: { required: true, type: String }
  }
};
</script>

<style scoped>
.desc {
  position: absolute;
  padding: 16px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  user-select: none;
  pointer-events: none;
}
.desc > div {
  text-align: center;
  max-width: 450px;
}
</style>
