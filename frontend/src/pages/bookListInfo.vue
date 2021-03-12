<template>
  <div class="q-pa-md">
    <q-toolbar class="bg-positive text-white">
      <q-btn flat round dense icon="menu" />
      <q-toolbar-title>BookList Information</q-toolbar-title>

      <q-space />

      <q-btn flat round dense icon="apps" class="q-mr-xs" />
      <q-btn flat round dense icon="more_vert" />
    </q-toolbar>

    <div
      class="row no-wrap items-center q-mt-md q-pa-sm bg-grey-3 rounded-borders text-center"
    >
      <div class="q-gutter-md text-center">
        <q-select
          filled
          v-model="allBooks"
          label="Select"
          :options="['All', 'Active', 'Inactive']"
          style="width: 440px"
          behavior="menu"
        />
      </div>
      <div>
        <div class="q-pa-md q-gutter-md text-center">
          <q-btn
            color="positive"
            icon-right="print"
            @click="print"
            label="Print PDF"
          />

          <q-chip square class="text-h6">
            <q-avatar color="positive" text-color="white">{{
              active
            }}</q-avatar>
            Active
          </q-chip>
          <q-chip square class="text-h6">
            <q-avatar color="dark" text-color="white">{{ inactive }}</q-avatar>
            Inactive
          </q-chip>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <q-card-section>
          <q-card class="my-card" style="width: 435px">
            <q-card>
              <q-card-section>
                <div class="text-h4 text-center">Create a Record</div>
              </q-card-section>
              <q-card-section
                v-if="!isEditing"
                class="q-pt-md"
                style="width: 430px"
              >
                <q-input v-model="text" label="Title" />
                <q-input v-model="text1" label="Author" />
                <q-input v-model="text2" label="Year" />
                <q-input v-model="text3" label="Description" />
                <div class="q-pa-md q-gutter-sm">
                  <q-input
                    class="bg-positive text-white text-h5"
                    type="submit"
                    value="Add"
                    @click="save"
                  />
                </div>
              </q-card-section>
              <q-card-section v-else class="q-pt-md" style="width: 430px">
                <q-input v-model="text" label="Title" />
                <q-input v-model="text1" label="Author" />
                <q-input v-model="text2" label="Year" />
                <q-input v-model="text3" label="Description" />
                <div class="q-pa-md q-gutter-sm">
                  <q-input
                    class="bg-positive text-white text-h5"
                    type="submit"
                    value="Update"
                    @click="updateBook(records)"
                  />
                </div>
              </q-card-section>
            </q-card>
            <q-space />

            <br />
            <br />
            <pie-chart
              :donut="true"
              :data="[
                ['Active', allRecords.filter((t) => !t.status).length],
                ['Inactive', allRecords.filter((t) => t.status).length],
              ]"
            ></pie-chart>
          </q-card>
          <br />
        </q-card-section>
      </div>
      <q-space />

      <div class="col-9">
        <q-card class="my-card">
          <q-card-section>
            <div class="q-pa-md">
              <q-list bordered padding class="rounded-borders">
                <q-item
                  clickable
                  v-ripple
                  v-for="(records, i) in bookFiltered"
                  :key="'records-' + i"
                >
                  <q-item-section avatar top>
                    <!-- <q-checkbox v-model="records.status" /> -->
                    <q-checkbox
                      :value="records.status"
                      @click.native="toggleStatus(records)"
                    />
                  </q-item-section>
                  <q-item-section
                    :class="{
                      'text-strike': records.status,
                      'text-grey': records.status,
                    }"
                  >
                    <div class="row">
                      <div class="col">
                        <q-item-label
                          ><span class="text-subtitle2">Title:</span>
                          {{ records.title }}</q-item-label
                        >
                        <q-item-label>
                          <span class="text-subtitle2">Author:</span>
                          {{ records.author }}</q-item-label
                        >

                        <q-item-label>
                          <span class="text-subtitle2">Year:</span>
                          {{ records.year }}</q-item-label
                        >
                        <q-item-label>
                          <span class="text-subtitle2">Description:</span>
                          {{ records.description }}</q-item-label
                        >
                      </div>
                    </div>
                  </q-item-section>

                  <q-item-section side>
                    <q-btn
                      round
                      icon="edit"
                      size="sm"
                      color="green"
                      @click.native="edit(records)"
                    ></q-btn>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn
                      round
                      icon="delete"
                      size="sm"
                      color="red"
                      @click="remove(records._id || i)"
                    ></q-btn>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  mounted() {
    this.booklistSrvc = this.$dbCon.wingsService("booklist");
    this.booklistSrvc.on("dataChange", (booklistFromServer) => {
      this.allRecords = booklistFromServer;
    });
    this.booklistSrvc.init();
    // this.$dbCon.authenticate();
    // this.$dbCon.on("login", (user) => {
    //   console.log("user", user);
    // });
  },
  data() {
    return {
      isEditing: false,
      selectedIndex: null,
      // counter: 2,
      allBooks: "All",
      text: "",
      text1: "",
      text2: "",
      text3: "",

      allRecords: [{}],
    };
  },
  computed: {
    bookFiltered() {
      switch (this.allBooks) {
        case "Inactive":
          return this.allRecords.filter((u) => !u.status);
        case "Active":
          return this.allRecords.filter((u) => u.status);
        default:
          return this.allRecords;
      }
    },
    inactive() {
      return this.allRecords.filter(this.inProgress).length;
    },
    active() {
      return this.allRecords.filter(this.isCompleted).length;
    },
  },
  methods: {
    toggleStatus(records) {
      this.booklistSrvc.patch(records._id, {
        status: !records.status,
      });
    },

    async save() {
      await this.booklistSrvc.create({
        title: this.text,
        author: this.text1,
        year: this.text2,
        description: this.text3,
        status: false,
      });
      this.text = "";
      this.text1 = "";
      this.text2 = "";
      this.text3 = "";
    },
    async updateBook(records, i) {
      await this.booklistSrvc.patch(this.selectedIndex, this.booklistSrvc);
      this.text = "";
      this.text1 = "";
      this.text2 = "";
      this.text3 = "";
      this.isEditing = false;
    },

    edit(records, i) {
      this.isEditing = true;
      this.text = records.title;
      this.text1 = records.author;
      this.text2 = records.year;
      this.text3 = records.description;
      this.selectedIndex = i;
    },

    remove(i) {
      this.booklistSrvc.remove(i);
    },

    inProgress(allRecords) {
      return !this.isCompleted(allRecords);
    },

    isCompleted(allRecords) {
      return allRecords.status;
    },

    print() {
      const docDefinition = {
        content: [
          {
            table: {
              body: [
                ["Title", "Author", "Year", "Description"],
                ...this.allRecords.map((book) => [
                  book.title,
                  book.author,
                  book.year,
                  book.description,
                ]),
              ],
            },
          },
        ],
      };
      this.$pdfMake.createPdf(docDefinition).print();
    },
  },
};
</script>