<template>
  <div>
    <Top/>
    <Table/>
  </div>
</template>
<script>
import Table from '@/views/table'
import Top from '@/views/Top/index'

export default {
  components: {
    Table,
    Top,
  },
  data() {
    return {
    }
  },
  async mounted() {
  },
  methods: {},
}
</script>
<style lang="scss" scoped>
</style>
