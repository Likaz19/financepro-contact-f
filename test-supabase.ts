import { supabase } from './src/lib/supabase'

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase Connection...\n')

  try {
    // Test 1: Check if we can query the table
    console.log('Test 1: Checking contact_submissions table...')
    const { data: tableData, error: tableError } = await supabase
      .from('contact_submissions')
      .select('count')
      .limit(0)

    if (tableError) {
      console.log('❌ Table check failed:', tableError.message)
      console.log('   → Did you run the SQL setup script? See QUICK_SETUP.md')
    } else {
      console.log('✅ Table exists and is accessible')
    }

    // Test 2: Check if we can list storage buckets
    console.log('\nTest 2: Checking contact-attachments bucket...')
    const { data: buckets, error: bucketError } = await supabase
      .storage
      .listBuckets()

    if (bucketError) {
      console.log('❌ Storage check failed:', bucketError.message)
    } else {
      const contactBucket = buckets?.find(b => b.id === 'contact-attachments')
      if (contactBucket) {
        console.log('✅ Storage bucket exists:', contactBucket.name)
      } else {
        console.log('❌ Storage bucket "contact-attachments" not found')
        console.log('   → Create it manually in Supabase Dashboard > Storage')
      }
    }

    // Test 3: Try to insert a test record
    console.log('\nTest 3: Testing insert permission...')
    const { data: insertData, error: insertError } = await supabase
      .from('contact_submissions')
      .insert([{
        name: 'Test User',
        email: 'test@example.com',
        country_code: '+221',
        phone: '123456789',
        interests: ['Consulting'],
        services: [],
        modules: [],
        message: 'This is a test submission from the connection test script.'
      }])
      .select()

    if (insertError) {
      console.log('❌ Insert test failed:', insertError.message)
      console.log('   → Check RLS policies. See QUICK_SETUP.md')
    } else {
      console.log('✅ Insert permission works')
      console.log('   Test record created with ID:', insertData?.[0]?.id)
      
      // Clean up test record
      if (insertData?.[0]?.id) {
        await supabase
          .from('contact_submissions')
          .delete()
          .eq('id', insertData[0].id)
        console.log('   Test record cleaned up')
      }
    }

    console.log('\n' + '='.repeat(50))
    console.log('🎉 Connection test complete!')
    console.log('='.repeat(50))

  } catch (error) {
    console.error('\n❌ Unexpected error:', error)
  }
}

// Run the test
testSupabaseConnection()
