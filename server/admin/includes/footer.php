    </div><!-- .page-body -->
  </main><!-- .main-content -->
</div><!-- .admin-layout -->

<!-- Modal container (shared) -->
<div class="modal-overlay" id="modal-overlay" onclick="if(event.target===this) closeModal()">
  <div class="modal" id="modal">
    <div class="modal-header">
      <h3 id="modal-title">Modal</h3>
      <button class="modal-close" onclick="closeModal()" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="modal-body" id="modal-body"></div>
    <div class="modal-footer" id="modal-footer"></div>
  </div>
</div>

<script src="/assets/js/admin.js?v=4"></script>
<?php if (!empty($pageScript)): ?>
<script><?= $pageScript ?></script>
<?php endif; ?>
</body>
</html>
