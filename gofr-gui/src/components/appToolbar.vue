<template>
  <v-app-bar
    color="#00558f"
    light
    app
    clipped-left
    clipped-right
    height="60"
  >
    
    <router-link to="/">
      <div style="background-color: white; border-radius: 10px 10px 0px 0px;">
        <img src="../assets/momcare_logo.png" width="220" style="padding: 1rem 0.2rem 0 0.2rem" />
      </div>
    </router-link>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <template v-if="($keycloak && $keycloak.authenticated) || $store.state.auth.userID || $store.state.config.generalConfig.authDisabled">
        <v-btn
          text
          :href="dhisLink"
          v-if='dhisLink'
        >
          <img src="../assets/dhis2.png" />
        </v-btn>
      </template>
      <!--<div>
        <language-switcher />
      </div> -->
      <template v-if="$store.state.auth.userID">
        <v-menu offset-y open-on-hover>
          <template v-slot:activator="{ on }">
            <v-btn
                text
                color="white"
                v-on="on">
              <v-icon>mdi-account</v-icon> {{$store.state.auth.username}}
            </v-btn>
          </template>
          <v-list>
            <v-list-item>
              <v-list-item-title>
                <v-btn color="white" light to="/logout" small v-if="!$store.state.public_access">
                  <v-icon>mdi-logout</v-icon>{{ $t(`App.hardcoded-texts.Logout`) }}
                </v-btn>
                <v-btn color="white" light to="/logout-public" small v-else>
                  <v-icon>mdi-login</v-icon>{{ $t(`App.hardcoded-texts.Login`) }}
                </v-btn>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-toolbar-items>
  </v-app-bar>
</template>

<script>
// import LanguageSwitcher from "@/components/language-switcher";
export default {
  computed: {
    dhisLink () {
      if (this.$store.state.dhis.user.orgId) {
        return window.location.protocol + '//' + window.location.hostname
      } else {
        return false
      }
    }
  },
  components: {
    // LanguageSwitcher,
  }
}
</script>

<style scoped>
/deep/ .v-toolbar__content {
  padding: 0px !important;
}
</style>
```