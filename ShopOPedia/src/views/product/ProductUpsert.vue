<template>
  <div class="container">
    <div class="row border p-4 my-5 rounded">
      <div class="col-9">
        <form v-on:submit.prevent="handleSubmit">
          <div class="h2 text-center text-success">
            {{ productIdForUpdate ? 'Update' : 'Create' }} Product
          </div>
          <hr />
          <div v-if="errorList.length > 0" class="alert alert-danger pb-0">
            Please fix the following errors:
            <ul>
              <li v-for="error in errorList" :key="error">{{ error }}</li>
            </ul>
          </div>

          <div class="mt-3">
            <span class="text-muted">Name</span>
            <input type="text" v-model.trim="productObj.name" class="form-control" />
          </div>
          <div class="mt-3">
            <span class="text-muted">Description</span>
            <textarea v-model="productObj.description" type="text" class="form-control"></textarea>
          </div>
          <div class="mt-3">
            <span class="text-muted">Price</span>
            <input type="number" v-model.number="productObj.price" class="form-control" />
          </div>

          <div class="mt-3">
            <span class="text-muted">Sale Price</span>
            <input type="number" v-model.number="productObj.salePrice" class="form-control" />
          </div>
          <div class="mt-3">
            <span class="text-muted">Tags (comma-seperated)</span>
            <input
              type="text"
              v-model="productObj.tags"
              class="form-control"
              placeholder="e.g., modern, classic, luxury"
            />
          </div>
          <div class="form-check form-switch pt-3">
            <input
              class="form-check-input"
              v-model="productObj.isBestSeller"
              type="checkbox"
              role="switch"
            />

            <label class="form-check-label" for="bestseller"> Bestseller </label>
          </div>
          <div class="mt-3">
            <label class="text-muted">Category</label>
            <select class="form-select" v-model="productObj.category">
              <option v-for="option in PRODUCT_CATEGORIES" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">Image</label>
            <div class="input-group">
              <input type="file" class="form-control" />
            </div>
          </div>
          <div class="pt-3">
            <button class="btn btn-success m-2 w-25" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>Submit
            </button>
            <router-link
              :to="{ name: APP_ROUTE_NAMES.PRODUCT_LIST }"
              class="btn btn-secondary m-2 w-25"
            >
              Cancel
            </router-link>
          </div>
        </form>
      </div>
      <div class="col-3">
        <img
          :src="`https://placehold.co/600x400`"
          class="img-fluid w-100 m-3 p-3 rounded"
          alt="Product
        preview"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { PRODUCT_CATEGORIES } from '@/constants/appConstants'
import { useSwal } from '@/utility/useSwal'
import productService from '@/services/productService'
import { APP_ROUTE_NAMES } from '@/constants/routeNames'
const { showSuccess, showError, showConfirm } = useSwal()
const router = useRouter()
const route = useRoute()
const loading = ref(false)
const errorList = reactive([])
const productObj = reactive({
  name: '',
  description: '',
  price: 0,
  salePrice: 0,
  tags: [], //comma sepearated values
  isBestSeller: false,
  category: '',
  image: 'https://placehold.co/600x400',
})
const productIdForUpdate = route.params.id

onMounted(async () => {
  if (!productIdForUpdate) return
  loading.value = true
  try {
    const product = await productService.getProductById(productIdForUpdate)
    Object.assign(productObj, { ...product, tags: product.tags.join(', ') })
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
  }
})

async function handleSubmit() {
  try {
    loading.value = true
    errorList.length = 0 // clear it

    //validations
    if (productObj.name.length < 3) {
      errorList.push('Name should be at least 3 char long.')
    }
    if (productObj.price <= 0) {
      errorList.push('Price should be greater than 0.')
    }
    if (productObj.category === '') {
      errorList.push('Please select a category.')
    }

    if (!errorList.length) {
      const productData = {
        ...productObj,
        price: Number(productObj.price),
        salePrice: productObj.salePrice ? Number(productObj.salePrice) : null,
        tags: productObj.tags.length > 0 ? productObj.tags.split(',').map((tag) => tag.trim()) : [],
        bestseller: Boolean(productObj.isBestSeller),
      }
      await productService.createProduct(productData)
      showSuccess('Product created successfully')
      router.push({ name: APP_ROUTE_NAMES.PRODUCT_LIST })
      console.log(productData)
    }
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
  }

  console.log(productObj)
}
</script>
