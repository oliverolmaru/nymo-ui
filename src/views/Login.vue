<template>
    <v-container background="primary" fill-height>
        <v-row
            align="center"
            justify="center"
        >
            <v-col class="col-md-4">
                <v-card
                    elevation="2"
                    class="pa-5"
                >
                    <v-card-title>DigiNYMO</v-card-title>
                    <v-card-subtitle class="text-left">Palun sisesta oma kasutajaandmed</v-card-subtitle>
                    <v-card-text>
                        <v-form ref="loginForm">
                            <v-text-field
                                name="email"
                                autocomplete="email"
                                v-model="email"
                                :rules="rules.email"
                                label="E-mail"
                                clearable
                            ></v-text-field>
                            <v-text-field
                                name="current-password"
                                autocomplete="current-password"
                                :append-icon="showPwd ? 'mdi-eye' : 'mdi-eye-off'"
                                :rules="rules.password"
                                :type="showPwd ? 'text' : 'password'"
                                label="Parool"
                                v-model="password"
                                class="input-group--focused"
                                @click:append="showPwd = !showPwd"
                            ></v-text-field>
                        </v-form>
                    </v-card-text>
                    <v-card-actions class="flex-column align-stretch">
                        <v-row class="justify-center">
                            <v-col>
                                <v-btn
                                block
                                    elevation="1"
                                    color="primary"
                                    :loading="isLoading"
                                    @click="onSubmit()"
                                >Logi sisse</v-btn>
                            </v-col>
                        </v-row>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        <v-overlay :value="error" >
            <v-alert
            :type="success ? 'success' : 'error'"
            elevation="8"
            transition="fade-transition"
            >{{error}}
            </v-alert>
        </v-overlay>
    </v-container>
</template>

<script>
export default {
    name: 'Login',
    data(){
        return{
            email: '',
            password: '',
            showPwd: false,
            rules: {
                email: [
                    value => !!value || 'Kohustuslik väli.',
                ],
                password: [
                    value => !!value || 'Kohustuslik väli.'
                ],
            },
            error: '',
            success: false,
            isLoading: false
        }
    },
    methods: {
        onSubmit(){
            this.$store.dispatch("loginUser",{
                email: this.email,
                password: this.password
            }).then(() =>{
                this.$router.push({name: 'Home'});
            });
        }
    },
    computed: {

    },
    created(){
    }
}
</script>

<style>

</style>