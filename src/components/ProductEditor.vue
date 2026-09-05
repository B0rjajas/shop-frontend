<template>
    <div class="product-editor">
      <h2>{{ editingId ? 'Editar Producto' : 'Nuevo Producto' }}</h2>
      <el-form label-width="120px">
        <el-form-item label="Nombre">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="Descripción">
          <el-input v-model="form.description" />
        </el-form-item>
        <el-form-item label="Marca">
          <el-input v-model="form.brand" />
        </el-form-item>
        <el-form-item label="Precio">
          <el-input-number v-model="form.price" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="Precio oferta">
          <el-input-number v-model="form.discounted_price" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="Stock">
          <el-input-number v-model="form.stock" :min="0" />
        </el-form-item>
        <el-form-item label="Estado">
          <el-select v-model="form.status">
            <el-option :value="1" label="Activo" />
            <el-option :value="0" label="Inactivo" />
          </el-select>
        </el-form-item>
        <el-form-item label="Categoría">
          <el-select v-model="form.category_id">
            <el-option
              v-for="cat in categories"
              :key="cat.id"
              :value="cat.id"
              :label="cat.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Imagen principal">
          <input type="file" @change="handleImageUpload" accept="image/*" />
          <img v-if="form.image" :src="form.image.startsWith('http') ? form.image : API_URL + form.image" style="max-width: 150px; display: block; margin-top: 8px;" />
        </el-form-item>
        <el-form-item label="Detalle (editor)">
          <div style="border: 1px solid #ccc; z-index: 100;">
            <Toolbar
              style="border-bottom: 1px solid #ccc;"
              :editor="editorRef"
              :defaultConfig="toolbarConfig"
              :mode="'default'"
            />
            <Editor
              style="height: 400px; overflow-y: hidden;"
              v-model="form.detail"
              :defaultConfig="editorConfig"
              :mode="'default'"
              @onCreated="handleEditorCreated"
            />
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveProduct">Guardar</el-button>
          <el-button @click="$router.push('/admin/products')">Cancelar</el-button>
        </el-form-item>
      </el-form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, onMounted, shallowRef, onBeforeUnmount } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useProductStore } from '../stores/product';
  import { ElMessage } from 'element-plus';
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
  import { IDomEditor } from '@wangeditor/editor';
  import '@wangeditor/editor/dist/css/style.css';
  import { API_URL } from '@config';

  
  const route = useRoute();
  const router = useRouter();
  const store = useProductStore();
  const editingId = ref<number | null>(null);
  const categories = ref(store.categories);
  
  const form = reactive({
    name: '',
    description: '',
    brand: '',
    price: 0,
    discounted_price: 0,
    stock: 0,
    status: 1,
    category_id: undefined as number | undefined,
    image: '',
    detail: '',
  });
  
  const imageFile = ref<File | null>(null);
  
  // Editor
  const editorRef = shallowRef<IDomEditor | null>(null);
  const toolbarConfig = {
    excludeKeys: ['fullScreen', 'video'],
  };
  const editorConfig = {
    placeholder: 'Escribe el detalle del producto...',
    MENU_CONF: {
      uploadImage: {
        // Si quieres subir imágenes al servidor desde el editor, configura server, fieldName, etc.
        // Por ahora, usaremos imágenes base64 (para simplicidad) o puedes configurar upload.
        // Mejor configurar upload a tu backend:
        server: 'http://localhost:3000/api/upload',
        fieldName: 'file',
        // customInsert: (res: any, insertFn: any) => { ... }
      }
    }
  };
  
  const handleEditorCreated = (editor: IDomEditor) => {
    editorRef.value = editor;
  };
  
  onBeforeUnmount(() => {
    if (editorRef.value) {
      editorRef.value.destroy();
    }
  });
  
  // Cargar categorías
  onMounted(async () => {
    await store.fetchCategories();
    categories.value = store.categories;
  
    const id = route.params.id;
    if (id) {
      editingId.value = Number(id);
      const product = await store.fetchProduct(editingId.value);
      if (product) {
        Object.assign(form, product);
      }
    }
  });
  
  const handleImageUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      imageFile.value = target.files[0];
      // Mostrar preview local
      const reader = new FileReader();
      reader.onload = (e) => {
        form.image = e.target?.result as string; // temporal base64
      };
      reader.readAsDataURL(target.files[0]);
    }
  };
  
  const saveProduct = async () => {
    try {
      const data = new FormData();
      Object.keys(form).forEach(key => {
        const val = (form as any)[key];
        if (val !== undefined && val !== null) data.append(key, String(val));
      });
      if (imageFile.value) {
        data.append('image', imageFile.value);
      }
  
      if (editingId.value) {
        await store.updateProduct(editingId.value, data);
        ElMessage.success('Producto actualizado');
      } else {
        await store.createProduct(data);
        ElMessage.success('Producto creado');
      }
      router.push('/admin/products');
    } catch (error) {
      ElMessage.error('Error al guardar producto');
      console.error(error);
    }
  };
  </script>
  
  <style scoped>
  .product-editor {
    padding: 20px;
    max-width: 900px;
    margin: 0 auto;
  }
  </style>