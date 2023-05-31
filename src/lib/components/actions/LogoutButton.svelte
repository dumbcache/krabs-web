<script lang="ts">
    import logoutIcon from "$lib/assets/logout.svg?raw";
    import { signUserOut } from "$lib/scripts/utils";
</script>

<button class="button__signout btn" on:click={signUserOut} title="logout">
    {@html logoutIcon}
</button>

<style>
</style>
