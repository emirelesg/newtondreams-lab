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
  text-align: center;
  width: 100%;
  user-select: none;
  pointer-events: none;
}
</style>
