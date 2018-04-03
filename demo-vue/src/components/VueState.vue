<template>
  <div>
    <div class="form" @input="stricklandOnInput" @focusout="stricklandOnFocusOut">
      <div class="formfield">
        <input id="firstName" name="firstName" type="text"
          :class="firstNameState.validationClassName" v-model.trim="form.firstName" />
        <label for="firstName"
          :data-validation-message="firstNameState.validationMessage">First name</label>
      </div>
      <div class="formfield">
        <input id="lastName" name="lastName" type="text"
          :class="lastNameState.validationClassName" v-model.trim="form.lastName" />
        <label for="lastName"
          :data-validation-message="lastNameState.validationMessage">Last name</label>
      </div>
      <div class="formfield">
        <input id="username" name="username" type="text"
          :class="usernameState.validationClassName" v-model.trim="form.username" />
        <label for="username"
          :data-validation-message="usernameState.validationMessage">Username</label>
      </div>
      <div class="formfield">
        <input id="password" name="password" type="password"
          :class="passwordState.validationClassName" v-model.trim="form.password" />
        <label for="password"
          :data-validation-message="passwordState.validationMessage">Password</label>
      </div>
      <div class="formfield">
        <input id="confirmPassword" name="confirmPassword" type="password"
          :class="confirmPasswordState.validationClassName" v-model.trim="form.confirmPassword" />
        <label for="confirmPassword"
          :data-validation-message="confirmPasswordState.validationMessage">Confirm</label>
      </div>
      <div class="formactions">
        <div>
          <button @click="onSubmit">Submit</button>
        </div>
        <div>
          {{(validation && validation.isValid) ? 'Can Submit' : 'Cannot Submit Yet'}}
        </div>
      </div>
    </div>
    <pre id="current-state">
        {{ JSON.stringify({ form: this.form, validation: this.validation }, null, 2) }}
    </pre>
  </div>
</template>

<script>
import formValidator from '../../../demo/src/formValidator'
import validate from 'strickland'
import formValidationMixin from '../mixins/vueStricklandMixin.js'
import mapFormFieldValidationState from '../mappers/vueStricklandMappers.js'

export default {
  name: 'VueState',
  mixins: [
    formValidationMixin
  ],
  data () {
    return {
      form: {
        firstName: null,
        lastName: null,
        username: null,
        password: null,
        confirmPassword: null
      },
      validationDependencies: {
        password: ['confirmPassword']
      },
      validation: formValidator.emptyResults()
    }
  },
  computed: {
    ...mapFormFieldValidationState([
      'firstName',
      'lastName',
      'username',
      'password',
      'confirmPassword'
    ])
  },
  methods: {
    onSubmit (event) {
      this.validation = validate(formValidator, this.form)

      if (this.validation.validateAsync) {
        this.validation.validateAsync(() => this.form)
          .then((result) => {
            this.validation = result
            this.onSubmitImpl()
          })
          .catch(() => console.log('Error validating async'))
      } else {
        this.onSubmitImpl()
      }
    },
    onSubmitImpl () {
      if (this.validation.isValid) {
        alert('submitted')
      } else {
        alert('submission denied')
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
