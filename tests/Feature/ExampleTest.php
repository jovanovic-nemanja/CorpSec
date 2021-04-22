<?php



it('tests the config api works', function() {
    $response = $this->get('/api/config');

    $response->assertStatus(200);
});
