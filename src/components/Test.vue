<template>
    <div><button @click="goUserPage">go user page</button></div>
</template>
<script>
export default {
    methods: {
        goUserPage() {
            this.$router.push('/user')
        }
    }
}
</script>